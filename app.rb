require "sinatra"
require "sinatra/reloader" 
require "dm-core"
require "dm-validations"
require "dm-migrations"
require "dm-timestamps"
require "dm-sqlite-adapter"
require 'dm-serializer'

require 'active_support'
require 'active_support/core_ext'

require "armor"
require "bcrypt"
require "securerandom"
require 'rack/contrib'
require 'rack-flash'
require 'json'

class User 
  include DataMapper::Resource
  attr_accessor :password, :password_confirmation
  
  property :id,             Serial
  property :email,          String, :required => true, :unique => true, :format => :email_address
  property :password_hash,  Text
  property :password_salt,  Text
  property :token,          String
  
end

class Task 
  include DataMapper::Resource
  
  property :id,             Serial
  property :task_text,      Text, :required => true
  property :completed,      Boolean, :default => false
  property :due_date,       DateTime
  property :created_at,     DateTime
  property :updated_at,     DateTime
  property :push_count,     Integer, :default  => 0
  property :someday_column, Integer, :default  => 0
  
  def self.push_tasks
    temptime = Time.now()
    roundedtime = Time.new(temptime.year, temptime.month, temptime.day)
    today = roundedtime
    
    tasks = self.all(:completed.not => true) & self.all(:due_date.lt => today)
    for t in tasks
      t.update(:due_date => today)
      t.update(:push_count => t.push_count + 1)
    end
    
    
  end  
end

require_relative "config"

use Rack::Session::Pool
use Rack::Flash
use Rack::PostBodyContentTypeParser

helpers do

  #Check to see if request coming from API or Website
  #Choose which authorize method to use
  def protected!

        # response['WWW-Authenticate'] = %(Basic realm="Restricted Area")
        # throw(:halt, [401, "Not authorized\n"])
      unless authorized?
        session[:redirect] = request.env["REQUEST_PATH"]
        redirect "/login"
      end

  end

  def authorized?
    # @auth ||=  Rack::Auth::Basic::Request.new(request.env)
    # @auth.provided? && @auth.basic? && @auth.credentials && @auth.credentials == ['admin', 'admin']    
    # 
    session[:user]
    
  end
  
  def format_task(text)
    
    colon_index = text.index(":")
    
    if colon_index
      "<span class='label'>" + text.insert(colon_index+1, "</span>")
    else
      text
    end
  
  end

end

get "/" do
  # protected!
  
    beginning_of_week = Time.now.beginning_of_week(:sunday)
    
    @tasks_by_day= []
    for i in 0..6

      tasks = Task.all(:due_date.gte => beginning_of_week.advance(days: i)-1, :due_date.lte => beginning_of_week.advance(days: i)  + (60*60*24) -1, :order => [:completed.asc, :task_text.asc]  )
      if tasks
          @tasks_by_day.push(tasks) 
        else
          @tasks_by_day.push([])
        end
    end
  
    @someday_tasks = []
    for j in 0..6
      tasks = Task.all(:due_date => nil, :someday_column => j, :completed => false, :order => [:completed.asc, :task_text.asc] )
      if tasks
          @someday_tasks.push(tasks) 
        else
          @someday_tasks.push([])
        end
    end
  
    erb :index, :layout => true
end

get "/login" do
  
  erb :login, :layout => true
  
end

get "/completed" do
        @tasks = Task.all(:completed => true, :order => [:completed.asc, :task_text.asc]  )
  
  erb :completed, :layout => true
end

post "/login" do
  if user = User.first(:email => params[:user][:email])

    if user.password_hash == Armor.digest(params[:user][:password], user.password_salt)

      session[:user] = user.token 

      if defined?(session[:redirect])
        redirect session[:redirect] 
      else
        redirect "/"
      end
    else
      flash[:warn] = "Unrecognized username or password"
      redirect "/login"
    end
  else
    flash[:warn] = "Unrecognized username or password"
    redirect "/login"
  end
end

get "/logout" do
  session[:user] = ""
  flash[:notice] = "You've been logged out."
  redirect "/"
end


get "/todos" do
  content_type :json
  
  search_date = DateTime.parse(params[:date])
  
  tasks = Task.all(:due_date.gte => search_date, :due_date.lte => search_date.advance(days: 1), :order => [:completed.asc, :task_text.asc])
  tasks.to_json
end

get "/todo/:id" do

end

post "/todo/?" do
    content_type :json
  # protected!
    if params[:_method] == "put"
      if update_task(params)
        {"success" => true}.to_json
      else
        {"success" => false}.to_json      
      end
      
    else
      
      task = Task.create(:task_text => params[:title], :due_date => params[:dueDate], :someday_column => params[:somedayColumn], :completed => params[:complete])
      if task.saved?
        task.to_json
      else
        #TODO Log error
        { "success" => false, "error" => "Not saved.."}.to_json
      end
    end
end

post "/todo/:id" do
  protected!
  task = Task.get(params[:id])
  if(task.completed)
    if task.update(:completed => false)
      { "success" => true, "id" => task.id}.to_json
    else
      { "success" => false, "error" => "Not saved.."}.to_json
    end    
  else
    if task.update(:completed => true)
      { "success" => true, "id" => task.id}.to_json
    else
      { "success" => false, "error" => "Not saved.."}.to_json
    end
  end
end

put "/todo" do
  task = Task.get(params[:id])
  
  if task.update(:due_date => params[:dueDate], :someday_column => params[:somedayColumn], :completed => params[:complete])
    { "success" => true, "id" => task.id}.to_json
  else
    { "success" => false, "error" => "Not saved.."}.to_json
  end
end

post "/deploy/:key" do
  #Github IPs 207.97.227.253, 50.57.128.197, 108.171.174.178, 127.0.0.1
  
  iplist = ["207.97.227.253", "50.57.128.197", "108.171.174.178", "127.0.0.1"]
  puts request.ip
  puts Dir.pwd
  if(params[:key] == "yTLr8Vy6AGADyC" && iplist.include?(request.ip))
    exec("./deploy.sh #{Dir.pwd}")
    
  end
  # deploy.sh 
end


get "/todo/day/:date" do
    @time = Time.new(params[:date][0,4].to_i, params[:date][4,2].to_i, params[:date][6,3].to_i)
  
    #render day

    @tasks = Task.all(:due_date.gte => @time-1, :due_date.lte => @time + (60*60*24) -1, :order => [:completed.asc, :task_text.asc]  )

    erb :_day, :layout => false
end

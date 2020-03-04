class HelloController < ApplicationController
  skip_before_action :verify_authenticity_token
  protect_from_forgery with: :null_session

  def index
    request = AlexaRubykit::build_request(params)
    message = Message.new(message:request.slots[:message][:value])
    message.save
    response = AlexaRubykit::Response.new
    response.add_speech(message)
    # render ('hello/show')
    render json: response.build_response
  end

  def show
    @message = "アレクサに話しかけてください。"
    if Message.all.length != 0 #データベースがからの時の例外処理
      @message = Message.find(Message.all.length).message
    end
  end
end

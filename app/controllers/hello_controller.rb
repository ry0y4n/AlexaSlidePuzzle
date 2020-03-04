class HelloController < ApplicationController
  skip_before_action :verify_authenticity_token
  protect_from_forgery with: :null_session

  $message = String.new
  def index
    request = AlexaRubykit::build_request(params)
    $message = request.slots[:message][:value]
    response = AlexaRubykit::Response.new
    response.add_speech("#{request.slots[:message][:value]}")
    # render ('hello/show')
    render json: response.build_response
  end

  def show
  end
end

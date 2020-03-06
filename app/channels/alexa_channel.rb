class AlexaChannel < ApplicationCable::Channel
  def subscribed
    stream_from "alexa:message"
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
  end
end

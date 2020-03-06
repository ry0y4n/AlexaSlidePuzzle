class PuzzleController < ApplicationController
    skip_before_action :verify_authenticity_token
    protect_from_forgery with: :null_session

    def index
        @operation = Operation.last.operation
        
        case @operation
        when '上'
            @opeNum = 0
        when '下'
            @opeNum = 1
        when '左'
            @opeNum = 2
        when '右'
            @opeNum = 3
        end
    end

    def create
        request = AlexaRubykit::build_request(params)
        operation = Operation.create(operation:request.slots[:operation][:value])

        response = AlexaRubykit::Response.new
        response.add_speech("#{request.slots[:operation][:value]}へ移動したいんだね")
        # render ('hello/show')
        render json: response.build_response
    end
end

Rails.application.routes.draw do
  post '/' => "hello#index"
  get '/show' => "hello#show"
  
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
  
  #post '/puzzle' => "puzzle/create"
  post '/puzzle' => "puzzle#create"
  get '/8puzzle' => "puzzle#index"
end

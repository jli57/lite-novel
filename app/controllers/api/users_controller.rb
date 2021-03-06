class Api::UsersController < ApplicationController

  def index
    @users = User.where(id: params[:userIds] )
      .with_attached_profile_photo
  end

  def create
    @user = User.new(user_params)
    file = File.open('app/assets/images/default.jpg')
    @user.profile_photo.attach(io: file, filename: 'default.jpg')
    if @user.save
      login! @user
      render :show
    else
      render json: @user.errors.keys, status: 422
    end
  end


  def update
    @user = User.find_by_id(params[:id])

    if @user.update(user_params)
      render :show
    else
      render json: @user.errors.full_messages, status: 422
    end
  end

  def search
    keyword = "%#{params[:search_text].downcase}%"
    @users = User.where(<<-SQL, keyword, keyword, keyword)
        lower(first_name) LIKE ? OR
        lower(last_name) LIKE ? OR
        concat_ws(' ', lower(first_name), lower(last_name)) LIKE ?
    SQL
    render :index
  end

  private

  def user_params
    params.require(:user).permit(
      :first_name,
      :last_name,
      :email,
      :mobile_number,
      :password,
      :gender,
      :year,
      :month,
      :day,
      :profile_photo )
  end

end

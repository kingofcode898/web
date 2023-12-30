import React, { useContext } from 'react' 
import { UserContext } from '../userContext'
import '../Sass/Profile.scss'
import Navbar from './NavbarComponent'

function ProfileComponent() {
  const [CurrentUser, setCurrentUser] = useContext(UserContext)

  console.log(CurrentUser)
  return (
    <div>
      <Navbar/> 
      <p className='Username-profile'>{CurrentUser.username}</p>
      <p className='follower-count-profile'>{CurrentUser.followers}</p>
    </div>
  )
}

export default ProfileComponent
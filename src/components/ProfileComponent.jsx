import React, { useContext } from 'react' 
import { UserContext } from '../userContext'
import '../Sass/Profile.scss'
import Navbar from './NavbarComponent'

function ProfileComponent() {
  const [CurrentUser, setCurrentUser] = useContext(UserContext)

  console.log(CurrentUser)
  return (
    <>
      <Navbar/> 
      <div className='main-info'>
        <p className='Username-profile'>{CurrentUser.username}</p>
        <p className='follower-count-profile'>{CurrentUser.followers}</p>
        <p className='bio-profile'>{CurrentUser.bio}</p>
      </div>
    <div className="User-posts">This will be the post box</div>
    </>
    
  )
}

export default ProfileComponent
import React from 'react' 
import '../Sass/Profile.scss'
import Navbar from './NavbarComponent'
import { useAuth } from '../userContext' 
function ProfileComponent() {
  const { currentUser } = useAuth()
    
  return (
    
    <>
      <Navbar/> 
      <div className='main-info'>
        <image href=''>profile picture</image>
        <p className='Username-profile'>Username: {currentUser.username }</p>
        <p className='follower-count-profile'>followers: {currentUser.num_followers}</p>
        <p className='bio-profile'>bio</p>
      </div>
    <div className="User-posts">This will be the post box</div>
    </>
    
  )
}

export default ProfileComponent  
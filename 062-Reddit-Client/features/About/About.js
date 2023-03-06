import React from 'react';
import './About.css';
import Card from '../../components/Card/Card';
import { selectAbout } from '../../app/appSlice';
import { useSelector } from 'react-redux';
import { IoLogoReddit } from "react-icons/io5";

const About = () => {
    const about = useSelector(selectAbout);
    let color;
    if (about.primary_color) {
        color = about.primary_color;
    } else {
        color = 'var(--color-outline)';
    }

    return (
        <Card className="about-card">
            <div className="about-banner-container" style={{ background: color }}>
                {about.banner_img && <img src={about.banner_img} alt="cover" className={about.banner}></img>}
            </div>

            <div className='subreddit-info'>
                <div className="avatar-container">
                    {about.icon_img ? <img src={about.icon_img} className="subreddit-avatar main" alt="subreddit avatar"></img> : <IoLogoReddit className="subreddit-avatar main" />}
                </div>


                <div className="subreddit-details">
                    <div className="subreddit-titles">
                        <h2>{about.title}</h2>
                        <h3 className="subreddit-name">{about.display_name_prefixed}</h3>
                        <p>{about.public_description}</p>
                    </div>

                    <div className="subreddit-users">
                        <span>Subscribers: {about.subscribers}</span>
                        <span>Online: {about.accounts_active}</span>
                    </div>
                </div>
            </div>
        </Card>
    )
}

export default About;
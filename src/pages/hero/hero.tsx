import ProfileImage from '../../assets/profile.jpg';
import GithubIcon from '../../assets/icons/github.svg';
import LinkedInIcon from '../../assets/icons/linkedin.svg';
import TwitterIcon from '../../assets/icons/twitter.svg';
import InstagramIcon from '../../assets/icons/instagram.svg';

export const Hero = () => {
    return (
        <div className="w-11/12 md:w-4/5 lg:w-3/5 mx-auto">
            <div className="py-5">
                <img src={ProfileImage} alt="Ashin Berish" className="h-28 my-4 w-28 border-2 rounded-full"></img>
                <h1 className="text-xl font-medium">Ashin Berish</h1>
                <h3 className="text-sm font-medium text-slate-500">Software Engineer / Tech Enthusiast</h3>
            </div>
            <div className='flex gap-x-3 mb-4'>
                <a href='https://github.com/ashinberish' className="text-slate-500"><img src={GithubIcon} alt='github' /></a>
                <a href='https://www.linkedin.com/in/ashin-berish/' className="text-slate-500"><img src={LinkedInIcon} alt='linkedin' /></a>
                <a href='https://twitter.com/ashinberish' className="text-slate-500"><img src={TwitterIcon} alt='twitter' /></a>
                <a href='https://instgram.com' className="text-slate-500"><img src={InstagramIcon} alt='instgram' /></a>
            </div>
            <hr className="flex-grow border-t border-gray-300"></hr>
            <div className='py-4'>
                <h3 className='font-medium text-gray-900 mb-2 text-lg'>About</h3>
                <p className='text-gray-500 text-sm mt-1 mb-4'>Coding wizard by day, caffeine-fueled debugger by night. Turning coffee into code since 2022.</p>
                <h3 className='font-medium text-gray-900 mt-1 mb-4 text-lg'>Experience</h3>
                <ol className="relative border-s border-gray-200 dark:border-gray-700">
                        <li className="mb-10 ms-4">
                            <div className="absolute w-3 h-3 bg-gray-200 rounded-full mt-1.5 -start-1.5 border border-white dark:border-gray-900 dark:bg-gray-700"></div>
                            <h3 className="text-base font-semibold text-gray-900 dark:text-white">Software Engineer</h3>
                            <p className="text-sm font-normal text-gray-500 dark:text-gray-400">Excelencia iTech consulting, Chennai</p>
                            <time className="mb-4 text-xs font-normal leading-none text-gray-400 dark:text-gray-500">April 2022 - Present</time>
                        </li>
                    </ol>
            </div>

        </div>
    )
}
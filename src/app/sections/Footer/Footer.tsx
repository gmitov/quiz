import Styles from './Footer.module.scss';
import Image from 'next/image';

import ManualLogo from '../../../../public/assets/ManualLogo.png';
import FooterNavigation from './components/FooterNavigation/FooterNavigation';
import FollowUs from './components/FollowUs/FollowUs';

const Footer = () => {
    return (
        <div className={Styles.container}>
            <div className={Styles.footerTop}>
                <div className={Styles.logoContainer}>
                    <Image src={ManualLogo} alt="ManualLogo" className={Styles.logo} width={75} height={75} />
                </div>
                <div className={Styles.navigationContainer}>
                    <FooterNavigation />
                    <FollowUs />
                </div>
            </div>
            <div className={Styles.footerBottom}>
                <div className={Styles.horizontalLine} />
                <span className={Styles.tradeMark}>© 2021 Manual. All rights reserved</span>
            </div>
        </div>
    );
};

export default Footer;

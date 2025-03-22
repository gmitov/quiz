'use client';

import Styles from './ContentHeader.module.scss';
import ManualLogo from '../../../../public/assets/ManualLogo.png';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const ContentHeader = () => {
    const router = useRouter();
    const backgroundImage = '/assets/ContentHeadingBackground.jpg';

    const handleQuizStart = () => {
        router.push('/quiz');
    };

    return (
        <div className={Styles.headerContainer} style={{ backgroundImage: `url(${backgroundImage})` }}>
            <div className={Styles.logoContainer}>
                <Image src={ManualLogo} alt="ManualLogo" className={Styles.logo} width={40} height={40} />
            </div>
            <div className={Styles.headerTextContainer}>
                <h1 className={Styles.heading}>Be good to yourself</h1>
                <p className={Styles.subTitle}>
                    We&apos;re working around the clock to bring you a holistic approach to your wellness. From top to
                    bottom, inside and out.
                </p>
                <button
                    data-testid={'buttonCallToAction'}
                    className={Styles.buttonCallToAction}
                    onClick={handleQuizStart}>
                    Take the quiz
                </button>
            </div>
        </div>
    );
};

export default ContentHeader;

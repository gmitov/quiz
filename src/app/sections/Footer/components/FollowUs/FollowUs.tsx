import Icon from '@/app/components/Icon/Icon';
import Styles from './FollowUs.module.scss';
import CategoryStyles from '../FooterNavigation/FooterCategory.module.scss';

const FollowUs = () => {
    return (
        <div className={Styles.container}>
            <div className={CategoryStyles.header}>Follow us</div>
            <div className={Styles.iconContainer}>
                <Icon name="facebook" className={Styles.facebookIcon} />
                <Icon name="google" />
                <Icon name="twitter" />
            </div>
        </div>
    );
};

export default FollowUs;

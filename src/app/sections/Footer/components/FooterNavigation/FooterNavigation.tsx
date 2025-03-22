import { CompanySection, InfoSection, ProductSection } from './FooterCategories.data';
import FooterCategory from './FooterCategory';
import Styles from './FooterNavigation.module.scss';

const FooterNavigation = () => {
    const navigationCategories = [ProductSection, CompanySection, InfoSection];

    return (
        <div className={Styles.container}>
            {navigationCategories.map((category) => {
                return <FooterCategory key={category.id} header={category.header} items={category.items} />;
            })}
        </div>
    );
};

export default FooterNavigation;

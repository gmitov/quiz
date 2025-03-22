import { NavigationItemType } from './FooterCategories.data';
import Styles from './FooterCategory.module.scss';

type FooterCategoryProps = {
    header: string;
    items: NavigationItemType[];
};

const FooterCategory = ({ header, items }: FooterCategoryProps) => {
    return (
        <div className={Styles.container}>
            <div className={Styles.header}>{header}</div>
            {items.map((item) => {
                return (
                    <div key={item.id} className={Styles.item}>
                        {item.name}
                    </div>
                );
            })}
        </div>
    );
};

export default FooterCategory;

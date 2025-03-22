import Image, { StaticImageData } from 'next/image';
import { ContentTextAlignment } from './ContentTreatment.data';
import Styles from './ContentTreatment.module.scss';
import clsx from 'clsx';

type ContentTreatmentProps = {
    numberBackground: number;
    contentHeader?: string;
    contentDirection: ContentTextAlignment;
    header: string;
    subHeader: string;
    contentText: string;
    contentImage: StaticImageData;
};

const ContentTreatment = ({
    contentHeader,
    numberBackground,
    contentDirection,
    header,
    subHeader,
    contentText,
    contentImage,
}: ContentTreatmentProps) => {
    const numberBackgroundTrailingZero = numberBackground <= 9 ? `0${numberBackground}` : numberBackground;

    return (
        <div>
            {contentHeader && (
                <div className={Styles.contentHeaderContainer}>
                    <h3 className={Styles.contentHeaderText}>{contentHeader}</h3>
                </div>
            )}

            <div
                className={clsx(
                    Styles.contentContainer,
                    contentDirection === ContentTextAlignment.right && Styles.contentReversed
                )}>
                <div
                    className={clsx(
                        Styles.textContainer,
                        contentDirection === ContentTextAlignment.right
                            ? Styles.textContainerRight
                            : Styles.textContainerLeft
                    )}>
                    <div className={Styles.headerText}>{header}</div>
                    <div className={Styles.subHeaderText}>{subHeader}</div>
                    <div className={Styles.contentText}>{contentText}</div>
                </div>
                <div>
                    <Image src={contentImage} alt={header} width={370} height={445} className={Styles.contentImage} />
                </div>
                <div
                    className={clsx(
                        Styles.backgroundNumber,
                        contentDirection === ContentTextAlignment.right ? Styles.rightNumber : Styles.leftNumber
                    )}>
                    {numberBackgroundTrailingZero}
                </div>
            </div>
        </div>
    );
};

export default ContentTreatment;

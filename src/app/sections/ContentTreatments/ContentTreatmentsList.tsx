import ContentTreatment from './ContentTreatment';
import { treatments } from './ContentTreatment.data';
import Styles from './ContentTreatmentsList.module.scss';

const ContentTreatmentsList = () => {
    return (
        <div className={Styles.treatmentsListContainer}>
            {treatments.map((treatment, index) => (
                <ContentTreatment
                    key={treatment.id}
                    numberBackground={index + 1}
                    contentHeader={treatment.contentHeader}
                    contentDirection={treatment.contentDirection}
                    header={treatment.header}
                    subHeader={treatment.subHeader}
                    contentText={treatment.contentText}
                    contentImage={treatment.contentImage}
                />
            ))}
        </div>
    );
};

export default ContentTreatmentsList;

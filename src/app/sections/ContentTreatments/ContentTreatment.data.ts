import HairLossImage from '../../../../public/assets/HairLossExample.png';
import ManImage from '../../../../public/assets/Man.png';

export enum ContentTextAlignment {
    left = 'LEFT',
    right = 'RIGHT',
}

export const treatments = [
    {
        id: 'hairLoss',
        contentHeader: 'What can we help with',
        contentDirection: ContentTextAlignment.right,
        header: 'hair loss',
        subHeader: 'Hair loss needn’t be irreversible. We can help!',
        contentText:
            'We’re working around the clock to bring you a holistic approach to your wellness. From top to bottom, inside and out.',
        contentImage: HairLossImage,
    },
    {
        id: 'erectileDisfunction',
        contentDirection: ContentTextAlignment.left,
        header: 'erectile dysfunction',
        subHeader: 'Erections can be a tricky thing. But no need to feel down!',
        contentText:
            'We’re working around the clock to bring you a holistic approach to your wellness. From top to bottom, inside and out.',
        contentImage: ManImage,
    },
];

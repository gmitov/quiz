/**
 * Fixes common issues with image URLs in the quiz API
 *
 * The API data contains some malformed image URLs in the srcset attribute:
 * 1. Some have spaces that break the URLs
 * 2. Some have incorrect %402 instead of %402x
 *
 * This function cleans up these issues.
 */
export function fixImageUrls(html: string): string {
    // Fix spaces in srcset attribute
    let fixedHtml = html.replace(/srcset="([^"]*?)(\s2x)"/g, 'srcset="$1"');

    // Fix %402 x.png to %402x.png (remove space)
    fixedHtml = fixedHtml.replace(/%402\s*x/g, '%402x');

    return fixedHtml;
}

/**
 * Gets a descriptive alt text for the image based on its value
 */
export function getImageAltText(value: string | boolean): string {
    if (typeof value === 'boolean') {
        return value ? 'Yes' : 'No';
    }

    return `Image showing ${value} hair loss pattern`;
}

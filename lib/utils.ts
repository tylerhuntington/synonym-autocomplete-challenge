import {clsx, type ClassValue} from "clsx"
import {twMerge} from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function generateUUID() {
    // Use crypto.getRandomValues for cryptographically secure random numbers
    const randomBytes = new Uint8Array(16);
    crypto.getRandomValues(randomBytes);

    // Set version to 4 (random UUID)
    randomBytes[6] = (randomBytes[6] & 0x0f) | 0x40;
    // Set variant to RFC4122
    randomBytes[8] = (randomBytes[8] & 0x3f) | 0x80;

    // Convert bytes to hex and format with dashes
    let uuid = '';
    for (let i = 0; i < 16; i++) {
        // Add dashes after positions 3, 5, 7, and 9
        if ([3, 5, 7, 9].includes(i)) {
            uuid += '-';
        }
        uuid += randomBytes[i].toString(16).padStart(2, '0');
    }

    return uuid;

}

export function sliceFromLastSpace(str) {
    const lastSpaceIndex = str.lastIndexOf(' ');
    // If no space is found, return the original string
    if (lastSpaceIndex === -1) {
        return str;
    }
    return str.slice(lastSpaceIndex + 1);
}

export function sliceStringBeforeLastWord(str, includeTrailingSpace = true) {
    const lastIndex = str.lastIndexOf(" ");
    const sliceEndIndex = includeTrailingSpace ? lastIndex + 1 : lastIndex
    // Handle cases with no spaces
    if (lastIndex === -1) {
        return "";
    }
    return str.slice(0, sliceEndIndex);
}

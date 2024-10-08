/* eslint-disable no-shadow */
import { useEffect, useState } from 'react';
import { getLoggedinUser } from '../../helpers/api_helper';

const useProfile = () => {
    const userProfileSession = getLoggedinUser();
    const token = userProfileSession && userProfileSession['token'];
    const [loading, setLoading] = useState(userProfileSession ? false : true);
    const [userProfile, setUserProfile] = useState(userProfileSession ? userProfileSession : null);

    useEffect(() => {
        const userProfileSession = getLoggedinUser();
        const token = userProfileSession && userProfileSession['token'];
        setUserProfile(userProfileSession ? userProfileSession : null);
        setLoading(token ? false : true);
    }, []);

    return { userProfile, loading, token };
};
const togglePassword = (id: string, iconID: string) => {
    const passwordInput = document.getElementById(id) as HTMLInputElement | null;
    const passwordIcon = document.getElementById(iconID);
    if (passwordInput && passwordIcon) {
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            passwordIcon.classList.remove('ri-eye-off-line');
            passwordIcon.classList.add('ri-eye-line');
        } else {
            passwordInput.type = 'password';
            passwordIcon.classList.remove('ri-eye-line');
            passwordIcon.classList.add('ri-eye-off-line');
        }
    }
};

const togglePasswordStrengthIn = (divID: string) => {
    const passwordStrengthValidation = document.getElementById(divID);
    if (passwordStrengthValidation) {
        passwordStrengthValidation.style.display = 'block';
    }
};

const togglePasswordStrengthOut = (divID: string) => {
    const passwordStrengthValidation = document.getElementById(divID);
    if (passwordStrengthValidation) {
        passwordStrengthValidation.style.display = 'none';
    }
};

const togglePasswordChange = (event: string) => {
    const numberPattern = /(?=.*?[0-9])/;
    const specialSymbolPattern = /(?=.*?[#?!@$%^&*-])/;
    const lowercasePattern = /(?=.*?[a-z])/;
    const uppercasePattern = /(?=.*?[A-Z])/;
    const minLengthPattern = /.{8,}/;

    const classNameChangeFunction = (id: string, oldClass: string, newClass: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.classList.remove(oldClass);
            element.classList.add(newClass);
        }
    };

    if (event) {
        classNameChangeFunction(
            'pass-special',
            specialSymbolPattern.test(event) ? 'invalid' : 'valid',
            specialSymbolPattern.test(event) ? 'valid' : 'invalid'
        );
        classNameChangeFunction(
            'pass-number',
            numberPattern.test(event) ? 'invalid' : 'valid',
            numberPattern.test(event) ? 'valid' : 'invalid'
        );
        classNameChangeFunction(
            'pass-lower',
            lowercasePattern.test(event) ? 'invalid' : 'valid',
            lowercasePattern.test(event) ? 'valid' : 'invalid'
        );
        classNameChangeFunction(
            'pass-upper',
            uppercasePattern.test(event) ? 'invalid' : 'valid',
            uppercasePattern.test(event) ? 'valid' : 'invalid'
        );
        classNameChangeFunction(
            'pass-length',
            minLengthPattern.test(event) ? 'invalid' : 'valid',
            minLengthPattern.test(event) ? 'valid' : 'invalid'
        );
        classNameChangeFunction(
            'pass-max-length',
            event.length >= 8 && event.length <= 12 ? 'invalid' : 'valid',
            event.length >= 8 && event.length <= 12 ? 'valid' : 'invalid'
        );
    } else {
        ['pass-number', 'pass-special', 'pass-lower', 'pass-upper', 'pass-length', 'pass-max-length'].forEach((id) =>
            classNameChangeFunction(id, 'valid', 'invalid')
        );
    }
};

const togglePasswordChangeVal = (event: string) => {
    const flag: boolean[] = [];
    if (event) {
        const numberPattern = /(?=.*?[0-9])/;
        const specialSymbolPattern = /(?=.*?[#?!@$%^&*-])/;
        const lowercasePattern = /(?=.*?[a-z])/;
        const uppercasePattern = /(?=.*?[A-Z])/;
        const maxLengthPattern = /.{8,}/;

        if (specialSymbolPattern.test(event)) flag[0] = true;
        else flag[0] = false;
        if (numberPattern.test(event)) flag[1] = true;
        else flag[1] = false;
        if (lowercasePattern.test(event)) flag[2] = true;
        else flag[2] = false;
        if (uppercasePattern.test(event)) flag[3] = true;
        else flag[3] = false;
        if (maxLengthPattern.test(event)) flag[4] = true;
        else flag[4] = false;
        if (event.length <= 12) flag[5] = true;
        else flag[5] = false;
    } else {
        flag[0] = false;
        flag[1] = false;
        flag[2] = false;
        flag[3] = false;
        flag[4] = false;
        flag[5] = false;
    }
    return flag.every((ele) => ele);
};
export { useProfile, togglePassword, togglePasswordStrengthIn, togglePasswordStrengthOut, togglePasswordChange, togglePasswordChangeVal };

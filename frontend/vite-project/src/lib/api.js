import { axiosInstance } from "./axios"


export const signup  = async(signupdata) => {
    const res = await axiosInstance.post('/auth/signup', signupdata);
    return res.data;
}

export const getAuthUser = async() => {
    const res = await axiosInstance.get('/auth/me');
    return res.data;
}

export const completeOnboarding = async(onboardingData) => {
    const res = await axiosInstance.post('/auth/onboarding', onboardingData);
    return res.data;
}
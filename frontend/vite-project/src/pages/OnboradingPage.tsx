import { useMutation, useQueryClient } from '@tanstack/react-query';
import React from 'react'
import toast from 'react-hot-toast';
import { completeOnboarding } from '../lib/api';
import useAuthUser from '../hooks/useAuthUser.js';

const OnboardingPage = () => {

  const { authUser } = useAuthUser();
  const queryClient = useQueryClient();

  const [formState, setFormState] = React.useState({
    fullName: authUser?.fullName || "",
    bio: authUser?.bio || "",
    nativeLanguage: authUser?.nativeLanguage || "",
    learningLanguage: authUser?.learningLanguage || "",
    location: authUser?.location || "",
    profilePic: authUser?.profilePic || "",
  });

  const { mutate: OnboardingMutation, isPending } = useMutation({
    mutationFn: completeOnboarding,
    onSuccess: (data) => {
      toast.success("Onboarding Completed");
      queryClient.invalidateQueries({ queryKey: ['authUser'] });
    }
  });
  const handleSubmit = (e) => {
    e.preventDefault();
    OnboardingMutation(formState);
  }


  return {

  }
}

export default OnboardingPage;
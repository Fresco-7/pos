"use client"
import useRestaurantModal from '@/components/hooks/useRestaurantModal';
import { Button } from '@/components/ui/button';
import React from 'react'


const NoRestaurantActions = () => {
    const restaurantModal = useRestaurantModal();
    return (
        <>
            <Button onClick={restaurantModal.onOpen}>Create Restaurant</Button>
        </>
    )
}

export default NoRestaurantActions;
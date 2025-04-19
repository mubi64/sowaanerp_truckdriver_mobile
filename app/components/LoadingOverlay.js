import React from 'react';
import Loading from '../components/Loading';

const LoadingOverlay = ({ visible }) => {
    if (!visible) return null;
    return <Loading />;
};

export default LoadingOverlay;

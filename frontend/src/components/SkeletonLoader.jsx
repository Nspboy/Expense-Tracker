import React from 'react';
import { motion } from 'framer-motion';

const SkeletonLoader = ({ width = '100%', height = '100%', borderRadius = '12px', className = '' }) => {
    return (
        <motion.div
            className={className}
            initial={{ opacity: 0.5 }}
            animate={{ opacity: 1 }}
            transition={{
                duration: 1,
                repeat: Infinity,
                repeatType: 'reverse',
                ease: 'easeInOut'
            }}
            style={{
                width,
                height,
                borderRadius,
                background: 'linear-gradient(90deg, #F2F2F7 25%, #E5E5EA 50%, #F2F2F7 75%)',
                backgroundSize: '200% 100%'
            }}
        />
    );
};

export const CardSkeleton = () => (
    <div className="flux-card" style={{ height: '180px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
            <SkeletonLoader width="80px" height="20px" />
            <SkeletonLoader width="32px" height="32px" borderRadius="50%" />
        </div>
        <SkeletonLoader width="140px" height="40px" marginBottom="16px" />
        <SkeletonLoader width="100px" height="20px" />
    </div>
);

export const TableRowSkeleton = () => (
    <div style={{ display: 'flex', gap: '16px', padding: '16px 24px', background: '#F9F9FB', borderRadius: '16px', marginBottom: '12px' }}>
        <SkeletonLoader width="15%" height="20px" />
        <SkeletonLoader width="15%" height="20px" />
        <SkeletonLoader width="40%" height="20px" />
        <SkeletonLoader width="15%" height="20px" />
        <SkeletonLoader width="15%" height="20px" />
    </div>
);

export default SkeletonLoader;

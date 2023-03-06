import React from "react";
import "./PostLoading.css";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";

const PostLoading = () => {
    return (
        <div className="card post-loading">
            <SkeletonTheme color="var(--color-outline)" highlightColor="#fff">
                <div className="skeleton-main-post">
                    <div className="skeleton-post-details">
                        <div className="avatar-skeleton">
                            <Skeleton circle={true} height={32} width={32} duration={2} />
                        </div>
                        <div>
                            <Skeleton height={14} width={80} duration={2} />
                        </div>
                    </div>

                    <Skeleton height={20} duration={3} />
                    <Skeleton height={20} duration={1.75} />
                </div>
                <div className="skeleton-comments-container">
                    <Skeleton height={14} width={100} duration={2} />
                </div>
            </SkeletonTheme>
        </div>
    )
};

export default PostLoading;
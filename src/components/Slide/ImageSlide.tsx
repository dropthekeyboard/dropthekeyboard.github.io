// ImageSlide.tsx
import React from 'react';

type ImageSlideProps = {
  imageUrl: string;
};

const ImageSlide: React.FC<ImageSlideProps> = ({ imageUrl }) => {
  return (
    <div data-testid="image-slide" className="relative w-screen h-screen overflow-hidden">
      <img
        data-testid="slide-image"
        src={imageUrl}
        alt="Immersive Slide"
        className="w-full h-full object-contain"
      />
    </div>
  );
};

export default ImageSlide;

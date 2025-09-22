// ImageSlide.tsx
import React from 'react';

type ImageSlideProps = {
  imageUrl: string;
};

const ImageSlide: React.FC<ImageSlideProps> = ({ imageUrl }) => {
  return (
    <div data-testid="image-slide" className="relative w-full h-screen min-w-[80vw] overflow-hidden">
      <img
        data-testid="slide-image"
        src={imageUrl}
        alt="Immersive Slide"
        className="absolute inset-0 w-full h-full object-cover"
      />
    </div>
  );
};

export default ImageSlide;

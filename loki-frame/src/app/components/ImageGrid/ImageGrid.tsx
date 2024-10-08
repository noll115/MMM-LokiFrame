"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ImageGridItem } from "./GridItem";
import { Image } from "@/drizzle/schema";

interface Props {
  serverImages: Image[];
  isMobile: boolean;
}

export default function ImageGrid({ serverImages, isMobile }: Props) {
  const [imagesDeleting, setImagesDeleting] = useState<number[]>([]);
  const [images, setImages] = useState(serverImages);
  const [pending, setPending] = useState(false);
  const [showImages, setShowImages] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setShowImages(true);
  }, []);

  useEffect(() => {
    if (images.some((img) => img.processing)) {
      const getImages = async () => {
        let res = await fetch("api/edit");
        setImages(await res.json());
      };
      let timeoutRef = setTimeout(getImages, 8000);
      return () => {
        clearTimeout(timeoutRef);
      };
    }
  }, [images]);

  const onImageClick = (id: number, deleting: boolean) => {
    if (deleting) {
      setImagesDeleting([...imagesDeleting, id]);
    } else {
      setImagesDeleting(imagesDeleting.filter((otherId) => otherId != id));
    }
  };

  const onDeleteImages = async () => {
    setPending(true);

    let res = await fetch("api/edit", {
      body: JSON.stringify(imagesDeleting),
      method: "DELETE",
    });

    setImages(await res.json());
    setPending(false);
    setImagesDeleting([]);
  };

  return (
    <>
      <div
        ref={scrollContainerRef}
        className="relative overflow-y-auto px-2"
      >
        <div className="grid grid-cols-4 md:grid-cols-5 lg:grid-cols-8 gap-1 max-w-max pointer pb-24">
          <AnimatePresence>
            {showImages &&
              images.map((image) => (
                <ImageGridItem
                  key={image.id}
                  isMobile={isMobile}
                  onClick={onImageClick}
                  image={image}
                  containerRef={scrollContainerRef}
                />
              ))}
          </AnimatePresence>
        </div>
      </div>
      <AnimatePresence>
        {imagesDeleting.length > 0 && (
          <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            className="flex pb-5 justify-center w-full fixed bottom-0 "
          >
            <button
              className="btn btn-lg btn-error font-bold btn-wide rounded-box"
              onClick={onDeleteImages}
              disabled={pending}
            >
              Delete {pending && <span className="loading loading-spinner" />}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

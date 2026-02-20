import clsx from 'clsx';
import Image from 'next/image';

interface CardProps {
  title: string;
  description?: string;
  image?: string;
  footer?: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export default function Card({ title, description, image, footer, className, onClick }: CardProps) {
  return (
    <div
      className={clsx("bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100", className)}
      onClick={onClick}
    >
      {image && (
        <div className="relative h-48 w-full bg-gray-100">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            unoptimized // Allow local images if needed, though 'fill' usually requires it or config
          />
        </div>
      )}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        {description && <p className="text-sm text-gray-600 mt-1 line-clamp-3">{description}</p>}
        {footer && <div className="mt-4 pt-4 border-t border-gray-50">{footer}</div>}
      </div>
    </div>
  );
}

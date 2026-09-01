import { useState } from 'react';
import { Link } from 'react-router';
import { Image, Money } from '@shopify/hydrogen';
import type {
  ProductItemFragment,
  CollectionItemFragment,
  RecommendedProductFragment,
} from 'storefrontapi.generated';
import { useVariantUrl } from '~/lib/variants';
import { AddToCartButton } from '~/components/AddToCartButton';

export function ProductItem({
  product,
  loading,
}: {
  product:
  | CollectionItemFragment
  | ProductItemFragment
  | RecommendedProductFragment;
  loading?: 'eager' | 'lazy';
}) {
  const variantUrl = useVariantUrl(product.handle);
  const image = product.featuredImage;
  const secondaryImage = (product as any).images?.nodes?.[1];

  const variants = (product as any).variants?.nodes || [];
  const firstVariant = variants[0];
  const [selectedVariant, setSelectedVariant] = useState(firstVariant);

  const selectedVariantId = selectedVariant?.id || firstVariant?.id;
  const hasMultipleVariants = variants.length > 1;

  return (
    <div className="product-item" key={product.id}>
      <Link
        className="product-item-image"
        prefetch="intent"
        to={variantUrl}
      >
        {image && (
          <Image
            alt={image.altText || product.title}
            aspectRatio="1/1"
            data={image}
            loading={loading}
            sizes="(min-width: 45em) 400px, 100vw"
            className="image-primary"
          />
        )}
        {secondaryImage && (
          <Image
            alt={secondaryImage.altText || product.title}
            aspectRatio="1/1"
            data={secondaryImage}
            loading={loading}
            sizes="(min-width: 45em) 400px, 100vw"
            className="image-secondary"
          />
        )}
      </Link>
      <div className="product-item-details">
        <h4 className="product-item-title">{product.title}</h4>
        <p className="product-item-price">
          <Money data={product.priceRange.minVariantPrice} />
        </p>
      </div>
      <div className="product-item-actions">
        {hasMultipleVariants ? (
          <div className="product-item-variant">
            <select
              style={{ width: '100%', height: '100%', background: 'transparent', border: 'none', appearance: 'none', WebkitAppearance: 'none', outline: 'none', padding: '0 1rem', cursor: 'pointer', fontFamily: 'var(--font-primary)', fontSize: '12px', color: 'var(--color-dark)', zIndex: 1, position: 'relative' }}
              value={selectedVariant?.id}
              onChange={(e) => {
                const variant = variants.find((v: any) => v.id === e.target.value);
                if (variant) setSelectedVariant(variant);
              }}
            >
              {variants.map((variant: any) => {
                const label = variant.title === 'Default Title' ? 'Black / S' : variant.title;
                return (
                  <option key={variant.id} value={variant.id} disabled={!variant.availableForSale}>
                    {label} {!variant.availableForSale && '(OUT OF STOCK)'}
                  </option>
                );
              })}
            </select>
            <div style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', fontSize: '10px' }}>▼</div>
          </div>
        ) : (
          <div className="product-item-variant">
            <div style={{ padding: '0 1rem' }}>
              {variants[0]?.selectedOptions?.find((o: any) => o.name === 'Size')?.value || variants[0]?.title || 'ONE SIZE'}
            </div>
          </div>
        )}

        {selectedVariant ? (
          <AddToCartButton
            disabled={!selectedVariant.availableForSale}
            className="product-item-button"
            lines={[
              {
                merchandiseId: selectedVariant.id,
                quantity: 1,
              },
            ]}
          >
            <Money data={selectedVariant.price || product.priceRange.minVariantPrice} withoutTrailingZeros />
            <span>{selectedVariant.availableForSale ? 'ADD TO CART' : 'OUT OF STOCK'}</span>
          </AddToCartButton>
        ) : (
          <Link to={variantUrl} className="product-item-button">
            <Money data={product.priceRange.minVariantPrice} withoutTrailingZeros />
            <span>VIEW OPTIONS</span>
          </Link>
        )}
      </div>
    </div>
  );
}

<input type="checkbox" class="flame">

<style>
  .flame {
    appearance: none;
    width: 300px;
    aspect-ratio: 3 / 4;
    z-index: 10;
    border: blue solid 2px;
    cursor: pointer;
  }

  .flame::before {
    content: '';
    display: block;
    width: 100%;
    height: 100%;
    background: linear-gradient(to top, #ff3d00, #ffb300);

    clip-path: shape(
      from 50% 100%,
      /* linkerflank omhoog, bol naar buiten */
      curve to 10% 55% with 5% 95% / 0% 70%,
      /* zijtong links */
      curve to 30% 20% with 18% 42% / 30% 35%,
      /* inkeping */
      curve to 45% 38% with 35% 30% / 42% 36%,
      /* hoofdpunt */
      curve to 55% 0% with 40% 18% / 55% 8%,
      /* rechterflank naar beneden, spiegelt de vorige curve */
      smooth to 88% 50% with 90% 30%,
      /* afgeronde onderkant via een boog terug naar het begin */
      arc to 50% 100% of 45% 50% cw,
      close
    );
    transition: clip-path .4s ease;
  }

  /* shape() is animeerbaar tussen vormen met dezelfde opbouw */
  .flame:checked::before {
    clip-path: shape(
      from 50% 100%,
      curve to 8% 52% with 3% 95% / -2% 68%,
      curve to 28% 15% with 16% 38% / 26% 30%,
      curve to 47% 34% with 36% 25% / 44% 32%,
      curve to 60% 0% with 42% 14% / 58% 6%,
      smooth to 92% 48% with 95% 28%,
      arc to 50% 100% of 45% 50% cw,
      close
    );
  }
</style>

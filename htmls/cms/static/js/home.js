document.addEventListener('DOMContentLoaded', function () {
  const marquee = document.getElementById('marquee');
  if (marquee) {
    const wrap = marquee.parentElement;
    marquee.innerHTML += marquee.innerHTML;

    let offsetX = 0;
    const speed = 2;
    let isPause = false;
    let singleWidth = 0;

    function calcWidth() {
      singleWidth = marquee.scrollWidth / 2;
    }

    calcWidth();
    window.addEventListener('resize', calcWidth);

    wrap.addEventListener('mouseenter', function () {
      isPause = true;
    });
    wrap.addEventListener('mouseleave', function () {
      isPause = false;
    });

    function animate() {
      if (!isPause) {
        offsetX -= speed;
        if (Math.abs(offsetX) >= singleWidth) {
          offsetX = 0;
        }
        marquee.style.transform = 'translateX(' + offsetX + 'px)';
      }
      requestAnimationFrame(animate);
    }

    animate();
  }

  const header = document.querySelector('.header');
  if (header) {
    window.addEventListener('scroll', function () {
      if (window.scrollY !== 0) {
        header.classList.add('hide');
      } else {
        header.classList.remove('hide');
      }
    });
  }

  let isScrolling = false;
  const pageCount = 7;

  function getSnapPoints() {
    const h = window.innerHeight;
    const points = [];
    for (let i = 0; i < pageCount; i++) {
      points.push(i * h);
    }
    return points;
  }

  window.addEventListener('wheel', async function (e) {
    e.preventDefault();
    if (isScrolling) return;
    isScrolling = true;

    const h = window.innerHeight;
    const snapPoints = getSnapPoints();
    const currentY = window.scrollY;
    let targetY;
    const lastPoint = snapPoints[snapPoints.length - 1];

    if (e.deltaY > 0) {
      const next = snapPoints.find(function (p) {
        return p > currentY;
      });
      if (next !== undefined) {
        targetY = next;
      } else {
        targetY = document.body.scrollHeight - h;
      }
    } else {
      if (currentY > lastPoint) {
        targetY = lastPoint;
      } else {
        const prevPoints = snapPoints.filter(function (p) {
          return p < currentY;
        });
        targetY = prevPoints.length ? prevPoints[prevPoints.length - 1] : 0;
      }
    }

    window.scrollTo({
      top: targetY,
      behavior: 'smooth'
    });

    await new Promise(function (resolve) {
      setTimeout(resolve, 600);
    });
    isScrolling = false;
  }, { passive: false });
});

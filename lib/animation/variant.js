export const easing = [0.6, -0.05, 0.01, 0.99];

export const animationContainer = {
  visible: {
    transition: {
      staggerChildren: 0.2,
      easing
    }
  }
};
export  const rotateAppear = {
    hidden: {
        opacity: 0,
        rotate: 45
      },
      visible: {
        opacity: 1,
        rotate: 0,
        transition: {
          duration: 0.5
        }
      }
};
export const fadeInUp = {
  hidden: {
    opacity: 0,
    y: 20
  },
  visible: (custom) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      delay: custom * 0.1 || 0
    }
  })
};

export const fadeInRight = {
  hidden: {
    opacity: 0,
    x: -50,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.2
    }
  }
};

export const fadeInLeft = {
  hidden: {
    opacity: 0,
    x: 50
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.5
    }
  }
};

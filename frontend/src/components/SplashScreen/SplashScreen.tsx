import { useRef, useEffect, FC } from 'react';
import { gsap } from 'gsap';
import SvgIcon from '@/components/SvgIcon/SvgIcon';
import styles from './SplashScreen.module.scss';

const SplashScreen: FC = () => {
    const heading1 = useRef(null);
    const imageLogo = useRef(null);

    const lettersArr = useRef(new Array());
    const letters = ['s', 'm', 'a', 'r', 't', 'e', 'r', '.'];

    useEffect(() => {
        const tl = gsap.timeline();
        tl.fromTo(
            heading1.current,
            { x: -750, autoAlpha: 0 },
            { x: 0, ease: 'elastic.out(1, .3)', duration: 1, autoAlpha: 1 }
        )
            .fromTo(lettersArr.current, { autoAlpha: 0, x: -30 }, { autoAlpha: 1, x: 0, stagger: 0.3 }, '-=.5')
            .fromTo(imageLogo.current, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.75 });
    }, []);

    return (
        <div className={styles.splashScreen}>
            <h1>
                <span ref={heading1} className={styles.heading1}>
                    kick
                </span>
                {letters.map((letter) => {
                    return (
                        <span
                            className={styles.heading2}
                            key={Math.random()}
                            ref={(element) => lettersArr.current.push(element)}>
                            {letter}
                        </span>
                    );
                })}
            </h1>
            <div ref={imageLogo} className={styles.imgcontainer}>
                <SvgIcon svgName="foot-ball" customClass={styles.logo} />
            </div>
        </div>
    );
};

export default SplashScreen;

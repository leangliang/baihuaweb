import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

const FeatureList = [
  {
    Svg: require('@site/static/img/opstwo.svg').default,
    description: (
      <>
        运维技能笔记记录，更方便回顾。
      </>
    ),
  },
  {
    Svg: require('@site/static/img/dev.svg').default,
    description: (
      <>
        学习以及随手记录的代码片段。
      </>
    ),
  },
  {
    Svg: require('@site/static/img/blog.svg').default,
    description: (
      <>
        日常的故障排查记录，随手记等。
      </>
    ),
  },
];

function Feature({Svg, title, description}) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}

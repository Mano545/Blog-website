
export default function Post1({ _id,title, summary, cover, content, createdAt, author }) {
  return (
    <div className="post">
      <div>
          <img className="post-img" src="https://images.pexels.com/photos/262508/pexels-photo-262508.jpeg"alt="" /></div>
      <div className="txt">
       
          <h2>Your Daily Dose of Inspiration: The Blog</h2>
          <p className="info">
          <a className="author">Mano</a>
          <time>24-01-2025 21:11</time>
        </p>
        <p className="fig">Steve Harrington from Stranger Things starts as a cocky high school jock but transforms into a fan-favorite, heroic character. Initially Nancy Wheeler’s boyfriend, he evolves into a protective "big brother" figure for the kids, especially Dustin. Known for his humor, bravery, and loyalty, Steve plays a key role in fighting supernatural threats while forming strong bonds with characters like Robin Buckley and the younger group.</p>
      </div>
    </div>
  );
}
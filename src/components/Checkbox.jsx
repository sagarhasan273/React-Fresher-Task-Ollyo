export default function Checkbox({
  index, handleChange, allchecked, hover,
}) {
  const style = {
    display: `${(hover === index || allchecked.includes(`${index}`)) ? 'block' : 'none'}`,
    position: 'absolute',
    top: '10px',
    left: '10px',
  };

  return (
    <div className="checkbox" style={style}>
      <input className="checkboxinput" value={index} type="checkbox" onChange={handleChange} />
    </div>
  );
}

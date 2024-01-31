export default (props: { height?: number, width?: number }) => {
    const { height = 20, width = 10 } = props;
    return <div style={{ height, width }}></div>
}
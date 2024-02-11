export default (props: { title: string }) => {
    return <h2 style={{ color: "rgb(25, 118, 210)" }} className="event-title">
        {props.title}
    </h2>
}
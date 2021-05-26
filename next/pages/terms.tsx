import withTitle from "../components/HOC/withTitle";

const Terms = () => (
    <iframe
        width="1904"
        height="768"
        src="https://www.youtube.com/embed/dQw4w9WgXcQ"
        title="YouTube video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen></iframe>
);

export default withTitle(Terms, "Terms of Service");

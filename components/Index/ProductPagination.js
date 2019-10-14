import { Container, Pagination } from "semantic-ui-react";
import {useRouter} from "next/router";

function ProductPagination({ totalPages }) {
  const router = useRouter();
  return (
    <Container
      textAlign="center"
      style={{ margin: "2em" }}
    >
      <Pagination
        defaultActivePage={1}
        totalPages={totalPages}
        onPageChange={(event, data) => {
          //console.log(data);
          let pageToShow = data.activePage;
          pageToShow === 1 ? router.push("/") : router.push(`/?page=${pageToShow}`);
        }}
      />
    </Container>
  );
}

export default ProductPagination;

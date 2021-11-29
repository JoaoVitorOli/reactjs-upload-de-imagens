import { Button, Box } from '@chakra-ui/react';
import { useMemo } from 'react';
import { useInfiniteQuery } from 'react-query';

import { Header } from '../components/Header';
import { CardList } from '../components/CardList';
import { api } from '../services/api';
import { Loading } from '../components/Loading';
import { Error } from '../components/Error';

export default function Home(): JSX.Element {
  async function fetchImages({ pageParam = null }) {
    const { data } = await api.get('/api/images', {
      params: {
        after: pageParam,
      },
    });

    return data;
  }

  const {
    data,
    isLoading,
    isError,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery(
    'images',
    // TODO AXIOS REQUEST WITH PARAM
    fetchImages,
    // TODO GET AND RETURN NEXT PAGE PARAM
    {
      getNextPageParam: (lastPage, pages) => {
        if (!lastPage.after) {
          return null;
        }
        
        return lastPage.after;
      }
    }
  );

  // console.log("data");
  // console.log(data && data.pages[0]);

  const formattedData = useMemo(() => {
    // TODO FORMAT AND FLAT DATA ARRAY
    const formatted = data?.pages.flatMap(imageData => {
      return imageData.data.flat();
    });
    
    return formatted;
  }, [data]);

  // TODO RENDER LOADING SCREEN
  if (isLoading && !isError) {
    return <Loading />;
  }

  if (!isLoading && isError) {
    return <Error />;
  }

  return (
    <>
      <Header />

      <Box maxW={1120} px={20} mx="auto" my={20}>
        <CardList cards={formattedData} />
        {/* TODO RENDER LOAD MORE BUTTON IF DATA HAS NEXT PAGE */}

        { hasNextPage && (
          <Button onClick={() => fetchNextPage()} disabled={isFetchingNextPage}>
            {isFetchingNextPage ? 'Carregando...' : 'Carregar mais'}
          </Button>
        ) }
      </Box>
    </>
  );
}

import { ApolloClient, gql, InMemoryCache } from '@apollo/client'
import Head from 'next/head'
import React from 'react';
import { Heading, Box, Flex, Input, IconButton, useToast, Stack } from '@chakra-ui/react'
import Characters from '../components/Characters';
import { SearchIcon, CloseIcon } from '@chakra-ui/icons';


export default function Home(results) {
  const initialState = results;
  const [characters, setCharacters] = React.useState(initialState.characters)
  const [search, setSearch] = React.useState('')
  const toast = useToast()

  return (
    <Flex direction='column' justify='center' align='center'>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Rick and Morty" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Box mb={4} flexDirection='column' align='center' justify='center' py={8}>
        <Heading as='h1' size='2x1' mb={8}>
          Rick and Morty
        </Heading>
        <form onSubmit={async (e) => {
          e.preventDefault()
          const result = await fetch('/api/searchCharacters', {
            method: 'post',
            body: search,
          })
          const { characters, error } = await result.json()

          if (characters.length === 0) {
            toast({
              position: 'bottom',
              title: 'an error occured',
              status: 'error',
              duration: 5000,
              inClosable: true,
            })
          } else {
            setCharacters(characters)
          }
        }}>
          <Stack maxWidth='350px' width='100%' isInline mb={8}>
            <Input placeholder='Search' value={search} onChange={(e) => setSearch(e.target.value)} >

            </Input>
            <IconButton colorScheme='blue' arial-label='Search Database' icon={<SearchIcon />}
              disabled={search === ''} type='submit' />
            <IconButton colorScheme='red' arial-label='Reset Button' icon={<CloseIcon />}
              onClick={async () => {
                setSearch('')
                setCharacters(initialState.characters)
              }} />
          </Stack>
        </form>
        <Characters characters={characters} />
      </Box>

      <main>

      </main>

      <footer>

      </footer>
    </Flex>
  )
}

export async function getStaticProps() {
  const client = new ApolloClient({
    uri: 'https://rickandmortyapi.com/graphql',
    cache: new InMemoryCache(),
  })
  const { data } = await client.query({
    query: gql`
      query {
        characters(page: 1) {
          info {
            count
            pages
          }
          results {
            name
            id
            location {
              id
              name
            }
            origin {
              id
              name
            }
            episode {
              id
              episode
              air_date
            }
            image
          }
        }
      }
    `,
  })

  return {
    props: {
      characters: data.characters.results
    }
  }
}
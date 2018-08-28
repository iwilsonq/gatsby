import React, { Component } from "react"
import { graphql } from "gatsby"
import { Link } from "gatsby"
import Layout from "../components/layout"
import Helmet from "react-helmet"
import typography, { rhythm, scale } from "../utils/typography"
import Img from "gatsby-image"
import CommunityHeader from "../views/community/community-header"
import presets, { colors } from "../utils/presets"
import GithubIcon from "react-icons/lib/go/mark-github"

//A variant of the Creators Header Design here with Breadcrumb of Creators > PEOPLE (Whatever) > Creator so clickable to go back to creators

class CreatorTemplate extends Component {
  constructor(props) {
    super(props)
    this.state = { sites: [] }
  }

  componentDidMount() {
    this.generateThumbnails()
  }

  generateThumbnails = () => {
    let sites = []
    let creator = this.props.data.creatorsYaml
    this.props.data.allSitesYaml.edges.map(site => {
      if (site.node.built_by === creator.name) {
        sites.push(site)
      }
    })
    this.setState({ sites: sites })
  }
  render() {
    const { data } = this.props
    const creator = data.creatorsYaml
    return (
      <Layout location={location}>
        <Helmet>
          <title>{creator.name}</title>
        </Helmet>
        <CommunityHeader />
        <main
          role="main"
          css={{
            padding: rhythm(3 / 4),
            display: `flex`,
            justifyContent: `center`,
            fontFamily: typography.options.headerFontFamily.join(`,`),
          }}
        >
          <div
            css={{
              margin: rhythm(3 / 4),
              flex: `1`,
              maxWidth: `720`,
            }}
          >
            <Img
              css={{
                minWidth: `100%`,
              }}
              alt={`${creator.name}`}
              fluid={creator.image.childImageSharp.fluid}
            />
          </div>
          <div
            css={{
              display: `flex`,
              flexDirection: `column`,
              margin: rhythm(3 / 4),
              flex: `1`,
              maxWidth: `720`,
            }}
          >
            {creator.for_hire || creator.hiring ? (
              <span css={[styles.badge]}>
                {creator.for_hire ? `Open For Work` : `Hiring`}
              </span>
            ) : null}
            <span
              css={{
                display: `flex`,
                borderBottom: `2px solid black`,
                alignItems: `center`,
              }}
            >
              <h1
                css={{
                  textTransform: `uppercase`,
                  margin: `0`,
                }}
              >
                {creator.name}
              </h1>
              {creator.github && (
                <GithubIcon
                  css={{
                    marginLeft: `auto`,
                  }}
                />
              )}
            </span>
            <span
              css={{
                borderBottom: `2px solid black`,
                padding: `${rhythm()} 0`,
              }}
            >
              <p
                css={{
                  margin: `0`,
                }}
              >
                {creator.description}
              </p>
            </span>
            <span
              css={{
                borderBottom: `2px solid black`,
                padding: `${rhythm(3 / 4)} 0`,
                display: `flex`,
              }}
            >
              <p
                css={{
                  margin: `0`,
                  textDecoration: `underline`,
                  fontWeight: `600`,
                  width: `150`,
                }}
              >
                Get in touch
              </p>
              <a
                href={creator.website}
                target="_blank"
                rel="noopener noreferrer"
              >
                {creator.website}
              </a>
            </span>
            <span
              css={{
                borderBottom: `2px solid black`,
                padding: `${rhythm(3 / 4)} 0`,
                display: `flex`,
              }}
            >
              <p
                css={{
                  margin: `0`,
                  textDecoration: `underline`,
                  fontWeight: `600`,

                  width: `150`,
                }}
              >
                From
              </p>
              <p
                css={{
                  margin: `0`,
                }}
              >
                {creator.location}
              </p>
            </span>
            {creator.portfolio && (
              <span
                css={{
                  borderBottom: `2px solid black`,
                  padding: `${rhythm(3 / 4)} 0`,
                }}
              >
                <p
                  css={{
                    margin: `0`,
                    marginBottom: rhythm(3 / 4),
                    textDecoration: `underline`,
                    fontWeight: `600`,
                    width: `150`,
                  }}
                >
                  Worked On
                </p>
                <div
                  css={{
                    display: `flex`,
                    alignItems: `flex-start`,
                  }}
                >
                  {this.state.sites.map(site => (
                    <Link
                      key={site.node.title}
                      css={{
                        "&&": {
                          marginRight: rhythm(3 / 4),
                          borderBottom: `none`,
                          boxShadow: `none`,
                          transition: `all ${presets.animation.speedDefault} ${
                            presets.animation.curveDefault
                          }`,
                          "&:hover": {
                            background: `none`,
                          },
                        },
                      }}
                      to={site.node.fields.slug}
                    >
                      <Img
                        alt={`${site.node.title}`}
                        fixed={
                          site.node.childScreenshot.screenshotFile
                            .childImageSharp.fixed
                        }
                      />
                    </Link>
                  ))}
                </div>
              </span>
            )}
          </div>
        </main>
      </Layout>
    )
  }
}

export default CreatorTemplate

export const pageQuery = graphql`
  query($slug: String!) {
    creatorsYaml(fields: { slug: { eq: $slug } }) {
      name
      description
      location
      website
      github
      image {
        childImageSharp {
          fluid {
            ...GatsbyImageSharpFluid
          }
        }
      }
      for_hire
      hiring
      portfolio
      fields {
        slug
      }
    }
    allSitesYaml {
      edges {
        node {
          built_by
          url
          title
          childScreenshot {
            screenshotFile {
              childImageSharp {
                fixed(width: 100, height: 100) {
                  ...GatsbyImageSharpFixed
                }
              }
            }
          }
          fields {
            slug
          }
        }
      }
    }
  }
`

const styles = {
  badge: {
    ...scale(-1 / 3),
    padding: `${rhythm(1 / 4)} 1.6rem`,
    margin: `${rhythm(3 / 4)} 0`,
    borderRadius: `20px`,
    alignSelf: `flex-start`,
    color: `white`,
    background: colors.gatsby,
    textTransform: `uppercase`,
  },
}

// (fields: { slug: { eq: $slug.match(/\/([^\/]+)\/?$/)[1] } })

// (fields: { creator: { eq: $slug } })

/*     allSitesYaml(filter: { built_by: { eq: "Andy Slezak" } }) {
      edges {
        node {
          built_by
          childScreenshot {
            screenshotFile {
              childImageSharp {
                fixed(width: 150, height: 150) {
                  ...GatsbyImageSharpFixed
                }
              }
            }
          }
          fields {
            slug
          }
        }
      }
    } */

/*     <Img
    css={{
      minWidth: `150`,
    }}
    alt={`${site.node.title}`}
    fixed={
      site.node.childScreenshot.screenshotFile
        .childImageSharp.fixed
    }
  />  */
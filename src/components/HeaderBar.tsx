import React from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { TezosDocumentation } from '../models'
import { capitalizeFirstLetter } from '../utils'

export const Menu = styled.ul`
  /* main UL component called: "Menu" */
  list-style-type: none;
  margin: 0;
  padding: 0;
  overflow: hidden;
  background-color: #fafafa;

  /* main LI */
  & > li {
    float: left;

    & > a {
      display: inline-block;
      color: black;
      text-align: center;
      padding: 14px 16px;
      text-decoration: none;

      &:hover {
        background-color: red;
      }
    }
  }

  /* dropdown LI */
  & > .dropdown {
    display: inline-block;

    & > .dropdown-content {
      display: none;
      position: absolute;
      background-color: #f9f9f9;
      min-width: 160px;
      box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
      z-index: 1;

      & > a {
        color: black;
        padding: 12px 16px;
        text-decoration: none;
        display: block;
        text-align: left;
        &:hover {
          background-color: #f1f1f1;
        }
      }
    }

    &:hover .dropdown-content {
      display: block;
    }
  }
`

const ControlsContainer = styled.div`
  display: flex;
  justify-content: center;
  flex: 1;
  margin: 0 15px;
  align-items: center;
`

const Heading = styled.nav`
  position: sticky;
  top: 0;
  width: 100%;
  height: 50px;
  box-sizing: border-box;
  background: #fafafa;
  border-bottom: 1px solid #cccccc;
  z-index: 10;
  padding: 5px;
  display: flex;
  align-items: center;
  font-family: Roboto, sans-serif;
`

const Logo = styled.img`
  margin-left: 86px;
  transform: rotate(90deg);
  display: flex;
  margin-right: 15px;
  @media screen and (max-width: 950px) {
    display: none;
  }
`

const createMenuBars = (networks: string[], endpoint: string) => {
  return networks.map((network, key) => (
    <Link
      key={key}
      reloadDocument={true}
      to={`/${endpoint}/${network.toLowerCase()}`}
    >
      {network}
    </Link>
  ))
}

export default function HeaderBar(parms: { documents: TezosDocumentation[] }) {
  const data = parms.documents
  const networks = Array.from(
    new Set(
      data
        ?.filter((data) => data.network !== 'all')
        .map((data) => capitalizeFirstLetter(data.network))
    )
  )
  networks.push('Mainnet')
  return (
    <Heading>
      <a href=".">
        <Logo
          src="https://uploads-ssl.webflow.com/616ab4741d375d1642c19027/6182aa129cd593489de5d546_logo-vertical.svg"
          alt="Redoc logo"
        />
      </a>
      <ControlsContainer></ControlsContainer>
      <Menu>
        <li className="dropdown">
          <a href="#" className="dropbtn">
            General Endpoints
          </a>
          <div className="dropdown-content">
            {createMenuBars(networks, 'general')}
          </div>
        </li>
        <li className="dropdown">
          <a href="#" className="dropbtn">
            Block Endpoints
          </a>
          <div className="dropdown-content">
            {createMenuBars(networks, 'blocks')}
          </div>
        </li>
        <li className="dropdown">
          <a href="#" className="dropbtn">
            Mempool Endpoints
          </a>
          <div className="dropdown-content">
            {createMenuBars(networks, 'mempool')}
          </div>
        </li>
      </Menu>
    </Heading>
  )
}

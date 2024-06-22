import React from 'react';
import { Footer as FlowbiteFooter } from 'flowbite-react';

export default function Footer() {
  return (
    <>
      <FlowbiteFooter container>
        <div className="w-full text-center">
          <div className="w-full justify-between sm:flex sm:items-center sm:justify-between">
            <FlowbiteFooter.Brand
              href="#"
              src="/src/image/Logo/logo-no-background.png"
              style={{ width: '150px', height: '100px', paddingLeft: '5px', paddingTop: '5px' }}
            />
            <FlowbiteFooter.LinkGroup style={{ fontSize: '16px' }}>
              <FlowbiteFooter.Link href="/home">Home</FlowbiteFooter.Link>
              <FlowbiteFooter.Link href="/about">About Us</FlowbiteFooter.Link>
              <FlowbiteFooter.Link href="/shop">Our Product</FlowbiteFooter.Link>
              <FlowbiteFooter.Link href="/contact">Contact Us</FlowbiteFooter.Link>
            </FlowbiteFooter.LinkGroup>
          </div>
          <hr />
          <FlowbiteFooter.Copyright
            href="#"
            by="SpiceCraft"
            year={2024}
            style={{ paddingTop: '20px', fontSize: '16px' }}
          />
        </div>
      </FlowbiteFooter>
    </>
  );
}

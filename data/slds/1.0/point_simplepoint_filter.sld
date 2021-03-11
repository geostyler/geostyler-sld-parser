<?xml version="1.0" encoding="ISO-8859-1"?>
<StyledLayerDescriptor version="1.0.0" xsi:schemaLocation="http://www.opengis.net/sld StyledLayerDescriptor.xsd"
  xmlns="http://www.opengis.net/sld"
  xmlns:ogc="http://www.opengis.net/ogc"
  xmlns:xlink="http://www.w3.org/1999/xlink"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <NamedLayer>
    <Name>Simple Point Filter</Name>
    <UserStyle>
      <Title>Simple Point Filter</Title>
      <FeatureTypeStyle>
        <Rule>
          <Name>Small populated New Yorks</Name>
          <Filter xmlns="http://www.opengis.net/ogc">
            <And>
              <PropertyIsEqualTo>
                <PropertyName>NAME</PropertyName>
                <Literal>New York</Literal>
              </PropertyIsEqualTo>
              <PropertyIsEqualTo>
                <PropertyName>TEST_BOOL</PropertyName>
                <Literal>true</Literal>
              </PropertyIsEqualTo>
              <PropertyIsNull>
                <PropertyName>TEST</PropertyName>
              </PropertyIsNull>
              <PropertyIsLike wildCard="*" singleChar="." escape="!">
                <PropertyName>TEST2</PropertyName>
                <Literal>*York*</Literal>
              </PropertyIsLike>
              <PropertyIsLike wildCard="*" singleChar="." escape="!">
                <PropertyName>TEST1</PropertyName>
                <Literal>*New*</Literal>
              </PropertyIsLike>
              <Not>
                <PropertyIsGreaterThan>
                  <PropertyName>POPULATION</PropertyName>
                  <Literal>100000</Literal>
                </PropertyIsGreaterThan>
              </Not>
              <Or>
                <PropertyIsEqualTo>
                  <PropertyName>TEST2</PropertyName>
                  <Literal>1</Literal>
                </PropertyIsEqualTo>
                <PropertyIsEqualTo>
                  <PropertyName>TEST2</PropertyName>
                  <Literal>2</Literal>
                </PropertyIsEqualTo>
              </Or>
            </And>
          </Filter>
          <MinScaleDenominator>10000</MinScaleDenominator>
          <MaxScaleDenominator>20000</MaxScaleDenominator>
          <PointSymbolizer>
            <Graphic>
              <Mark>
                <WellKnownName>circle</WellKnownName>
                <Fill>
                  <CssParameter name="fill">#FF0000</CssParameter>
                </Fill>
                <Stroke>
                  <CssParameter name="stroke">#000000</CssParameter>
                  <CssParameter name="stroke-width">2</CssParameter>
                </Stroke>
              </Mark>
              <Size>6</Size>
            </Graphic>
          </PointSymbolizer>
        </Rule>
      </FeatureTypeStyle>
    </UserStyle>
  </NamedLayer>
</StyledLayerDescriptor>

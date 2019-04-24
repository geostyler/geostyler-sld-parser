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
          <Name>Test</Name>
          <Filter xmlns="http://www.opengis.net/ogc">
            <And>
              <Or>
                <PropertyIsEqualTo>
                  <PropertyName>ID</PropertyName>
                  <Literal>1</Literal>
                </PropertyIsEqualTo>
                <PropertyIsEqualTo>
                  <PropertyName>ID</PropertyName>
                  <Literal>2</Literal>
                </PropertyIsEqualTo>
              </Or>
              <Or>
                <PropertyIsEqualTo>
                  <PropertyName>STREET</PropertyName>
                  <Literal>Main</Literal>
                </PropertyIsEqualTo>
                <PropertyIsEqualTo>
                  <PropertyName>STREET</PropertyName>
                  <Literal>Time square</Literal>
                </PropertyIsEqualTo>
                <And>
                  <PropertyIsGreaterThanOrEqualTo>
                    <PropertyName>HOUSENO</PropertyName>
                    <Literal>1909</Literal>
                  </PropertyIsGreaterThanOrEqualTo>
                  <PropertyIsLessThanOrEqualTo>
                    <PropertyName>HOUSENO</PropertyName>
                    <Literal>19909</Literal>
                  </PropertyIsLessThanOrEqualTo>
                </And>
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

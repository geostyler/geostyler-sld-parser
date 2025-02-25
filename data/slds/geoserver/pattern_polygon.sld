<?xml version="1.0" encoding="UTF-8"?>
<StyledLayerDescriptor version="1.0.0" xmlns="http://www.opengis.net/sld" xmlns:ogc="http://www.opengis.net/ogc"
  xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://www.opengis.net/sld http://schemas.opengis.net/sld/1.0.0/StyledLayerDescriptor.xsd">
  <NamedLayer>

    <Name>Pattern polygon</Name>

    <UserStyle>
      <Name>pattern_polygon</Name>
      <Title>Pattern polygon</Title>
      <Abstract>Polygon with spaced purple circle symbols</Abstract>
      <FeatureTypeStyle>
        <Rule>
          <Name>Polygon with spaced purple circle symbols</Name>
          <Abstract>Polygon with spaced purple circle symbols</Abstract>
          <PolygonSymbolizer>
            <VendorOption name="graphic-margin">4 6 2 3</VendorOption>
            <Fill>
              <GraphicFill>
                <Graphic>
                  <Mark>
                    <WellKnownName>circle</WellKnownName>
                    <Fill>
                      <CssParameter name="fill">#880088</CssParameter>
                    </Fill>
                  </Mark>
                  <Size>6</Size>
                </Graphic>
              </GraphicFill>
            </Fill>
          </PolygonSymbolizer>
        </Rule>
      </FeatureTypeStyle>
    </UserStyle>
  </NamedLayer>
</StyledLayerDescriptor>
